export interface PokeAPIPokemonResponse {
  id: number;
  name: string;
  sprites: {
    front_default?: string;
    [key: string]: any;
  };
  [key: string]: any;
}
