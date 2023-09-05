import {createContext, ReducerWithoutAction} from "react";

interface Context {
    state: ArboStateType,
    dispatch: any
}
interface ArboStateType {
    selectedFilters: { [key: string]: string[] }
}
interface ArboAction {
    type: ArboActionType,
    payload: any
}
enum ArboActionType {
    UPDATE_FILTER = 'UPDATE_FILTER',
}


export const initialState = {
    selectedFilters: {}
}
export const ArboContext = createContext<Context | null>(null);

export const reducer = (state: ArboStateType, action: ArboAction) => {
    switch (action.type) {
        default:
            return state;
    }
}