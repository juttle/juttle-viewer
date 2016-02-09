export default function observeStore(store, select, onChange) {
    let currentState = store.getState();

    function handleChange() {
        let nextState = select(store.getState());
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(nextState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    return unsubscribe;
}
