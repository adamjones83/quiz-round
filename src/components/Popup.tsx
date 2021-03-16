import * as React from "react";


export const Popup = (props: { children }) => {
    return <div className={ 'popup-outer hidden' }>
        <div className={ 'popup-inner' }>{ props.children }</div>
    </div>;
};
