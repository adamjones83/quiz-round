import * as React from "react";


export const Popup = (props: { children, visible }) => {
    return <div className={ props.visible ? 'popup-outer visible' : 'popup-outer' }>
        <div className={ 'popup-inner' }>{ props.children }</div>
    </div>;
};
