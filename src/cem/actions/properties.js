import fetch from 'isomorphic-fetch';

export const loadProperties = (dealKind) => {
  return (dispatch) => {
    return fetch(`/v1/properties/country`)
      .then((response) => response.json())
      .then((response) => {
        return dispatch({
          type: 'properties.load.list.succeeded',
          data: response,
        });
      }
    );
  }
}
