import { SoundType } from "../../types";
import { Map } from 'immutable';

export const audioFiles = {
    "buzzer-denied": "buzzer-denied.wav",
    "buzzer-times-up": "buzzer-times-up.wav",
    "buzzer-times-up2": "buzzer-times-up2.mp3",
    "buzzer-wrong1": "buzzer-wrong1.mp3",
    "buzzer-wrong2": "buzzer-wrong2.wav",
    "buzzer1": "buzzer1.wav",
    "buzzer2": "buzzer2.wav",
    "ding1": "ding1.wav",
    "ding2": "ding2.wav",
    "ding-right": "ding-right.mp3",
    "electronic-times-up": "electronic-times-up.wav",
    "electronic1": "electronic1.mp3",
    "electronic2": "electronic2.wav",
    "electronic3": "electronic3.wav",
    "notification1": "notification1.mp3",
    "pling1": "pling1.wav",
    "pling2": "pling2.wav",
    "pling3": "pling3.wav",
    "plop1": "plop1.wav",
    "price-is-wrong": "price-is-wrong.mp3"
}
export type SoundKey = keyof typeof audioFiles;

function getDefaultSoundMap():Record<SoundType,SoundKey> {
    return {
        'jump': 'pling3',
        'timeout-timer': 'buzzer-times-up2',
        'answer-timer': 'buzzer1',
        'jump-timer': 'buzzer1'
    } as Record<SoundType, SoundKey>;
}
const soundMap = Map(getDefaultSoundMap());

let soundDisabled = false;
export const enableSound = ():void => { soundDisabled = false };
export const disableSound = ():void => { soundDisabled = true };
export const playSound = (type: SoundType):void => {
    if(soundDisabled) return;
    const soundId = soundMap.get(type);
    console.log('play sound', { soundId, type });
    if(!soundId) return;
    console.log(`Play sound from audio file '${audioFiles[soundId]}'`);
    document.querySelector<HTMLAudioElement>(`audio#audio-${soundId}`).play();
}