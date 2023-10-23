import { tidy, filter } from '@tidyjs/tidy';

function getFilteredData(data, myFilter) {
  let filteredData = tidy(
    data,
    filter(d => myFilter.region === 'All' || myFilter.region === d.region),
    filter(d => myFilter.technology === 'All' || myFilter.technology === d.technology),
    filter(d => myFilter.status === 'All' || myFilter.status === d.status),
    filter(d => myFilter.yearSubmitted === 'All' || parseInt(myFilter.yearSubmitted) === d.yearSubmitted)
  );
  return filteredData;
}

export { getFilteredData };
