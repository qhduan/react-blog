import "isomorphic-fetch";

export const REQUEST = "HOME-REQUEST";
export const RECEIVE = "HOME-RECEIVE";

function requestData () {
  return {
    type: REQUEST
  }
}

function receiveData (data) {
  return {
    type: RECEIVE,
    data: data
  }
}

export function fetchData () {
  return dispatch => {
    dispatch(requestData());
    return fetch("/index.json")
      .then(response => response.json())
      .then(json => dispatch(receiveData(json)));
  };
}
