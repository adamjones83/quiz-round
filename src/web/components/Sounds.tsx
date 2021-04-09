import * as React from "react";
import { audioFiles } from '../handlers/sound-handler';

export const Sounds = ():ReturnType<React.FunctionComponent> => <div>
    { Object.entries(audioFiles).map(([id,path]) => {
        return <audio id={`audio-${id}`} key={id} src={ `data/${path}` } />;
    }) }
</div>;
