import { signal, type Signal } from "@preact/signals";
import type { PokeAPIPokemonResponse } from "../interfaces/pokeapi-response.interface";
import { Singleton } from "../utils/singleton";
import pokemonService from "./pokemon.service";
import eventBus from "../utils/event-bus";

export class ModalService extends Singleton {
  public readonly open: Signal<boolean> = signal(false);
  public readonly loading: Signal<boolean> = signal(false);
  public readonly error: Signal<string | null> = signal(null);
  public readonly data: Signal<PokeAPIPokemonResponse | null> = signal(null);

  protected constructor() {
    super();
    // listen to decoupled open events
    eventBus.on<number>("pokemon:open", (id: number) => {
      // fire and forget — ModalService manages its own errors/state
      void this.openById(id);
    });
  }

  async openById(id: number) {
    this.loading.value = true;
    this.error.value = null;
    try {
      const raw = await pokemonService.getPokemonByIdRaw(id);
      this.data.value = raw;
      this.open.value = true;
    } catch (e: any) {
      this.error.value = e?.message ?? String(e);
    } finally {
      this.loading.value = false;
    }
  }

  close() {
    this.open.value = false;
    this.data.value = null;
    this.error.value = null;
    this.loading.value = false;
  }
}

export const modalService = ModalService.getInstance<ModalService>();
export default modalService;
