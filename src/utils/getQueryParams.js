// eslint-disable-next-line no-return-assign, no-sequences
export const getQueryParams = (query = null) => (query || window.location.search.replace('?', '')).split('&').map(e => e.split('=').map(decodeURIComponent)).reduce((r, [k, v]) => (r[k] = v, r), {});
