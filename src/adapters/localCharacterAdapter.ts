import type { Character } from '../models/character'

const STORAGE_KEY = 'local_characters'

export class LocalCharacterAdapter {
  private readStorage(): Character[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw) as Character[]
    } catch (e) {
      console.warn('Failed reading local characters', e)
      return []
    }
  }

  private writeStorage(list: Character[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch (e) {
      console.warn('Failed writing local characters', e)
    }
  }

  async getAll(): Promise<Character[]> {
    return this.readStorage()
  }

  async getById(id: number): Promise<Character | undefined> {
    return this.readStorage().find((c) => c.id === id)
  }

  async save(character: Character): Promise<Character> {
    const list = this.readStorage()
    // avoid duplicates by id
    const exists = list.find((c) => c.id === character.id)
    if (!exists) list.push(character)
    else {
      // update
      const idx = list.findIndex((c) => c.id === character.id)
      list[idx] = character
    }
    this.writeStorage(list)
    return character
  }

  async delete(id: number): Promise<void> {
    const list = this.readStorage().filter((c) => c.id !== id)
    this.writeStorage(list)
  }
}
