export default (state = {}, action) => {
  switch (action.type) {
    case 'properties.load.list.succeeded': {
      return {
        ...state,
        data: action.data,
      }
    }
    default:
      return state
  }
}
