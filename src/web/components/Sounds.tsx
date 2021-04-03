import * as React from "react";

const audioFiles = {
    wrong: 'data/priceiswrong.mp3',
    right: 'data/rightanswer.mp3'
}
export const playSound = (soundId: keyof typeof audioFiles):void => {
    console.log(`Play sound from audio file '${audioFiles[soundId]}'`)
    // (document.querySelector(`audio#${soundId}`) as HTMLAudioElement).play();
}
export const Sounds = ():ReturnType<React.FunctionComponent> => <div>
    { Object.entries(audioFiles).map(([id,path]) => {
        return <audio id={id} key={id} src={ path } />;
    }) }
</div>;
