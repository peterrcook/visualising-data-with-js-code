const technologyColors = {
  'Advanced Conversion Technologies': '#FF9999',
  'Anaerobic Digestion': '#C58882',
  'Battery': '#B6A6CA',
  'Biomass (co-firing)': '#50723C',
  'Biomass (dedicated)': '#50723C',
  'EfW Incineration': '#B56B45',
  'Large Hydro': '#469B77',
  'Small Hydro': '#469B77',
  'Wind Onshore': '#6D98BA',
  'Wind Offshore': '#6D98BA',
  'Solar Photovoltaics': '#EEC170',
  'Landfill Gas': '#AF4319'
};

function technologyColorScale(name) {
  let fallback = '#ccc';
  return technologyColors[name] || fallback;
}

export { technologyColorScale };
