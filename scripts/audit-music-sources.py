"""Measure the retained original/processed stems; does not infer subjective isolation."""
import sys,json,hashlib
from pathlib import Path
import numpy as np
import soundfile as sf

source=Path(sys.argv[1]);out=Path(sys.argv[2]);items=[]
for folder in ['raw/spaceport-stems','raw/factory-stems','processed']:
 for file in sorted((source/folder).glob('*.wav')):
  info=sf.info(file);total=0.;peak=0.;samples=0;mono=[]
  with sf.SoundFile(file) as f:
   for data in f.blocks(blocksize=24000,dtype='float32',always_2d=True):
    total+=float(np.sum(data.astype('float64')**2));samples+=data.size;peak=max(peak,float(np.max(abs(data))))
   f.seek(min(int(info.samplerate*20),max(0,info.frames-info.samplerate*8)))
   mono=f.read(info.samplerate*8,always_2d=True).mean(axis=1)
  spectrum=abs(np.fft.rfft(mono*np.hanning(len(mono))))**2;freq=np.fft.rfftfreq(len(mono),1/info.samplerate)
  bands=[float(spectrum[(freq>=lo)&(freq<hi)].sum()/max(1e-20,spectrum.sum())) for lo,hi in [(0,200),(200,2000),(2000,12000)]]
  items.append({'file':str(file.relative_to(source)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'seconds':info.duration,'sampleRate':info.samplerate,'channels':info.channels,'rms':(total/samples)**.5,'peak':peak,'bandPowerFractions':bands})
# Correlation of the already aligned, lossless game groups. Bleed is not ruled out by low correlation.
correlations={}
for biome in ['spaceport','factory']:
 names=['bed','lead','bass','drums'];signals=[]
 for name in names:
  data,rate=sf.read(source/'processed'/f'{biome}-{name}.wav',always_2d=True);signals.append(data.mean(axis=1))
 assert len({len(d) for d in signals})==1
 correlations[biome]={'layers':names,'samples':len(signals[0]),'seconds':len(signals[0])/rate,'correlation':np.corrcoef(signals).tolist()}
result={'sourceFiles':items,'processedGroupCorrelation':correlations,'subjectiveListening':False,'limits':'Spectral distribution and correlation do not prove isolated instruments, key compatibility or pleasant transitions. Existing source BPM measurements and cut/phase provenance are retained; no audio asset was re-encoded.'}
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'sources':len(items),'alignedGroups':list(correlations),'subjectiveListening':False}))
