"""Valida a exportação real, decodificando seus 600 quadros e o áudio."""
from pathlib import Path
import json
import subprocess
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
VIDEO=ROOT/'deliverables/RRR-seu-estilo.mp4'
def run(args, **kwargs):
    return subprocess.run(args,check=True,capture_output=True,**kwargs)

probe=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(VIDEO)],text=True).stdout)
video=next(s for s in probe['streams'] if s['codec_type']=='video')
audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'])==(1080,1920)
assert video['codec_name']=='h264' and video['pix_fmt']=='yuv420p'
assert video['avg_frame_rate']=='30/1'
assert int(video['nb_read_frames'])==600
assert abs(float(probe['format']['duration'])-20)<.05
assert audio['codec_name']=='aac' and audio['channels']==2
assert abs(float(audio['duration'])-20)<.1

# Exercise the complete decoder; reject corrupt frames or broken audio packets.
decoded=run(['ffmpeg','-v','error','-i',str(VIDEO),'-f','null','-'])
assert not decoded.stderr.strip(),decoded.stderr.decode()

# Inspect every frame at reduced resolution. This is not a visual approval proxy.
raw=run(['ffmpeg','-v','error','-i',str(VIDEO),'-an','-vf','scale=108:192','-pix_fmt','gray','-f','rawvideo','-']).stdout
frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,192,108)
assert len(frames)==600
black=[int(i) for i,f in enumerate(frames) if np.percentile(f,99)<20]
assert not black,black
hold=frames[534:].astype(np.float32)
diff=np.abs(np.diff(hold,axis=0)).mean(axis=(1,2))
assert float(diff.max())<.8, float(diff.max())

report={
  'file':VIDEO.name,
  'status':'passed',
  'resolution':[video['width'],video['height']],
  'fps':30,
  'duration_seconds':float(probe['format']['duration']),
  'decoded_video_frames':int(video['nb_read_frames']),
  'video_codec':video['codec_name'],
  'pixel_format':video['pix_fmt'],
  'audio_codec':audio['codec_name'],
  'audio_sample_rate':int(audio['sample_rate']),
  'audio_channels':audio['channels'],
  'decode_errors':0,
  'black_frames':black,
  'end_card_hold_seconds':len(hold)/30,
  'max_mean_pixel_change_during_hold':round(float(diff.max()),5),
  'visual_review':'Inspect separately: framing, readable type, editorial rhythm, cuts and transitions.',
}
out=ROOT/'deliverables/validacao.json'
out.write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(report,indent=2,ensure_ascii=False))
