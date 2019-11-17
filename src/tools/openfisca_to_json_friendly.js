const openfiscaToJSON = (data) => {
  return Object.keys(data).reduce(
      (subkey) => {
        Object.keys(subkey).reduce(
            (result, item) => {
              return result.ap
            }, []
        )
      }, []
  )
};
