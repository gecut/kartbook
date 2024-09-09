export const lower = (event: InputEvent) => {
  return ((event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.toLowerCase().trim());
};

export const upper = (event: InputEvent) => {
  return ((event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.toUpperCase().trim());
};
