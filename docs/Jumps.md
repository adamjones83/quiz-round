# Code Flow for Jumping
1. an action is called that
    - calls jumpHandler.set()
    - if nothing is returned from jumpHandler.set
        * set questionState to jumpset
        * on jump changed, set the questionState to answer, and call showPopup with 'jump' as the type
    - if a list of already jumped quizzers is returned from jumpHandler.set
        * set the questionState to 'answer'
        * call showPopup with 'jump' as the popup type
    