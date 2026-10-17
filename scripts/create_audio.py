"""Trilha e efeitos originais. Síntese determinística, sem samples externos."""
from pathlib import Path
import wave
import numpy as np

SR = 48000
DURATION = 20
rng = np.random.default_rng(20261017)
mix = np.zeros((SR * DURATION, 2), dtype=np.float64)

def put(signal, start, gain=1, pan=0):
    offset = int(start * SR)
    if offset < 0:
        signal = signal[-offset:]
        offset = 0
    length = min(len(signal), len(mix) - offset)
    if length <= 0:
        return
    gains = np.array([np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)])
    mix[offset:offset+length] += signal[:length, None] * gains * gain

def timeline(seconds):
    return np.arange(int(seconds * SR)) / SR

def pitch(midi):
    return 440 * 2 ** ((midi - 69) / 12)

def kick():
    t = timeline(.38)
    phase = 2 * np.pi * (48*t + 85*.026*(1-np.exp(-t/.026)))
    return np.sin(phase)*np.exp(-t*13) + .1*rng.normal(size=len(t))*np.exp(-t*180)

def hat(opened=False):
    t = timeline(.18 if opened else .065)
    n = rng.normal(size=len(t))
    n = n-np.convolve(n, np.ones(13)/13, mode='same')
    return n*np.exp(-t*(28 if opened else 88))*.23

def clap():
    t = timeline(.15)
    n = rng.normal(size=len(t))
    n -= np.convolve(n, np.ones(25)/25, mode='same')
    env = sum(np.exp(-np.maximum(t-a, 0)*65)*(t>=a) for a in [0,.009,.021])
    return n * env * .16

def bass(note):
    t = timeline(.31)
    f = pitch(note)
    signal = np.sin(2*np.pi*f*t) + .18*np.sin(4*np.pi*f*t) + .065*np.sin(6*np.pi*f*t)
    return signal * (1-np.exp(-t*250))*np.exp(-t*11)

def pluck(note):
    t = timeline(.62)
    f = pitch(note)
    return (np.sin(2*np.pi*f*t)+.25*np.sin(2*np.pi*f*2.002*t)+.1*np.sin(2*np.pi*f*3*t))*(1-np.exp(-t*180))*np.exp(-t*7)

# 120 BPM: every major picture cut is on the 0.5-second beat grid.
for beat in range(40):
    s = beat*.5
    # Short breathing space before the hero and before the brand.
    quiet = (11.5 <= s < 12) or (15.5 <= s < 16)
    if not quiet:
        put(kick(),s,.72)
        if beat%2:
            put(clap(),s,.54, .07)
    for sub in [0,.25]:
        if not quiet:
            put(hat(opened=(sub==.25 and beat%4==3)),s+sub+.008,.3,-.3 if sub else .3)
    root = [33,29,36,31][(beat//4)%4]
    if not quiet:
        for sub,n,g in [(0,root,.36),(.375,root+12,.19)]:
            put(bass(n),s+sub,g)

chords = [[69,72,76,83],[65,69,72,76],[67,71,74,79],[67,71,76,81]]
for bar in range(10):
    chord = chords[bar%4]
    for k in range(8):
        at = bar*2+k*.25
        if 11.5 <= at < 12 or 15.5 <= at < 16:
            continue
        note = chord[[0,2,1,3,2,1,3,2][k]]
        sig = pluck(note)
        put(sig,at+.02,.075,(-.35 if k%2 else .35))
        put(sig,at+.27,.023,(.35 if k%2 else -.35))

# Soft, filtered air sweeps and short low impacts on the main cuts.
for cut in [3,7,12,16]:
    t = timeline(.34)
    n = rng.normal(size=len(t))
    n = np.convolve(n,np.ones(23)/23,mode='same')
    env = np.sin(np.pi*np.arange(len(t))/len(t))**1.5
    put(n*env,cut-.28,.21,-.15)
    t = timeline(.45)
    put(np.sin(2*np.pi*(57*t-12*t*t))*np.exp(-t*10),cut,.25)

# Cloth-like sweeps, deliberately quieter than the groove.
for at in [1.35,4.15,5.5,8.65,10.45,17.1]:
    t=timeline(.18)
    n=np.convolve(rng.normal(size=len(t)),np.ones(35)/35,mode='same')
    put(n*np.sin(np.pi*np.arange(len(t))/len(t))**2,at,.16,.35)

fadein=np.minimum(np.arange(len(mix))/(SR*.018),1)
fadeout=np.minimum((len(mix)-1-np.arange(len(mix)))/(SR*.55),1)
mix*=np.minimum(fadein,fadeout)[:,None]
mix=np.tanh(mix*1.15)
mix*=.88/np.max(np.abs(mix))
path=Path(__file__).resolve().parents[1]/'public/audio/rrr-runway.wav'
path.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(path),'wb') as out:
    out.setnchannels(2)
    out.setsampwidth(2)
    out.setframerate(SR)
    out.writeframes((mix*32767).astype('<i2').tobytes())
print(f'Trilha original: {path} | {DURATION}s | {SR}Hz | stereo')
