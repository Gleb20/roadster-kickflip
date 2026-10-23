#!/usr/bin/env python3
"""Rebuild the selected Suno source stems into phase-aligned 32-bar game loops.
Usage: python scripts/prepare-audio.py RAW_DIRECTORY FFMPEG_BINARY
Dependencies: numpy, scipy, soundfile. Originals stay outside the published tree.
"""
from pathlib import Path
import sys,json,subprocess,hashlib,tempfile
import numpy as np
import soundfile as sf
from scipy import signal
raw=Path(sys.argv[1]);ffmpeg=sys.argv[2]
root=Path(__file__).resolve().parents[1];dest=root/'assets/audio/music-v450';dest.mkdir(parents=True,exist_ok=True)
report={'bpm':128,'bars':32,'seconds':60,'sampleRate':24000,'seamMs':24,'tracks':{}}
# Measured drum onset regression over 129 beats, not the requested prompt tempo.
for biome,bpm,start in [('spaceport',132.0,15.94),('factory',130.03127932664,14.57)]:
 source=raw/(biome+'-stems');parts={};inputs=[]
 for f in sorted(source.glob('*.wav')):
  category=f.stem.rsplit('(',1)[-1].rstrip(')');y,rate=sf.read(f,dtype='float32');parts[category]=y
  inputs.append({'name':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'rms':float(np.sqrt(np.mean(y*y)))})
 # Keep the approved arrangement; omit tiny vocal-separation residues. No independently normalised stems.
 mixes={'bed':parts['Keyboard']*.8+parts['FX']*.7,'lead':parts['Synth']+parts.get('Brass',0)*.6+parts.get('Strings',0)*.6,'bass':parts['Bass'],'drums':parts['Drums']+parts['Percussion']*.65}
 loops={};n=60*24000;seam=576;lead=2400
 with tempfile.TemporaryDirectory() as tmp:
  for layer,y in mixes.items():
   # Mono low-frequency/rhythm layers limit decoded mobile memory; tonal layers retain stereo width.
   if layer in ['bass','drums']:y=y.mean(axis=1)
   src=Path(tmp)/'source.wav';warped=Path(tmp)/'warped.wav';sf.write(src,y,rate,subtype='FLOAT')
   subprocess.run([ffmpeg,'-v','error','-y','-ss',str(start-.1*128/bpm),'-i',str(src),'-af',f'atempo={128/bpm:.12f},highpass=f=35,lowpass=f=10000','-ar','24000','-t','60.2',str(warped)],check=True)
   z,r=sf.read(warped,dtype='float32',always_2d=True);assert len(z)>=n+lead
   out=z[lead:lead+n].copy();pre=z[lead-seam:lead]
   # Tail moves into the exact pre-roll before sample zero. No artificial silence at the seam.
   ramp=np.linspace(0,1,seam,dtype='float32')[:,None];ramp=.5-.5*np.cos(np.pi*ramp)
   out[-seam:]=out[-seam:]*(1-ramp)+pre*ramp
   out-=out.mean(axis=0);loops[layer]=out
  combined=sum(np.repeat(z,2,axis=1) if z.shape[1]==1 else z for z in loops.values());rms=float(np.sqrt(np.mean(combined*combined)));peak=float(np.max(np.abs(combined)))
  gain=min(.15/rms,.78/peak);outputs={}
  for layer,z in loops.items():
   z*=gain;wav=Path(tmp)/'loop.wav';sf.write(wav,z,24000,subtype='PCM_24');file=dest/f'{biome}-{layer}.mp3'
   subprocess.run([ffmpeg,'-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','112k' if z.shape[1]==2 else '72k','-write_xing','1',str(file)],check=True)
   # Preserve lossless verification intermediates outside Git for browser/offline seam inspection.
   qa=raw.parent/'processed';qa.mkdir(exist_ok=True);sf.write(qa/f'{biome}-{layer}.wav',z,24000,subtype='PCM_24')
   outputs[layer]={'file':str(file.relative_to(root)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'bytes':file.stat().st_size,'frames':n,'channels':z.shape[1],'rms':float(np.sqrt(np.mean(z*z))),'peak':float(np.max(np.abs(z))),'boundaryStep':float(np.max(abs(z[0]-z[-1])))}
 report['tracks'][biome]={'measuredBpm':bpm,'cutStartSeconds':start,'cutEndSeconds':start+128*60/bpm,'commonGain':gain,'mixRms':rms*gain,'mixPeak':peak*gain,'inputs':inputs,'outputs':outputs}
 print(biome,'gain',round(gain,4),'mix peak',round(peak*gain,4))
(root/'docs/verification/2026-10-23-audio-v450/processing.json').write_text(json.dumps(report,indent=2)+'\n')
