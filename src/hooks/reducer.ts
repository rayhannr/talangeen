import { Reducer, useReducer } from 'react'

export function useSimpleReducer<T>(initialValue: T) {
  return useReducer<Reducer<T, Partial<T>>>((prevState, newState) => ({ ...prevState, ...newState }), initialValue)
}
