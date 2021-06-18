export const fetchCountryInfo = async () => {
  const list = await fetch("https://api.covid19api.com/countries");
  return (await list.json()).sort((a, b) => (a.Country > b.Country ? 1 : -1));
};

export const fetchCountryCases = async (slug) => {
  const slugData = await fetch(
    `https://api.covid19api.com/total/country/${slug}/status/confirmed`
  );
  return slugData.json();
};
