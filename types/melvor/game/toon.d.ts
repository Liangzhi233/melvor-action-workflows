// noinspection JSUnusedGlobalSymbols

import {AttackStyle, AttackTypeID, CombatSpell, FoodItem, NamespacedObject} from 'melvor';
import type {EquipmentItem, Item} from './item';

export const enum EquipSlotType {
  Amulet = 'Amulet',
  Boots = 'Boots',
  Cape = 'Cape',
  Consumable = 'Consumable',
  Gloves = 'Gloves',
  Helmet = 'Helmet',
  Passive = 'Passive',
  Platebody = 'Platebody',
  Platelegs = 'Platelegs',
  Quiver = 'Quiver',
  Ring = 'Ring',
  Shield = 'Shield',
  Summon1 = 'Summon1',
  Summon2 = 'Summon2',
  Weapon = 'Weapon',
}

export type EquipSlotIDType = string;

export class Equipment {
  slotArray: EquipSlot[];

  slotMap: Map<EquipmentItem, EquipSlotType>;

  slots: Record<EquipSlotType, EquipSlot>;

  addQuantityToSlot(slot: EquipSlot, quantity: number): void;

  getQuantityInSlot(slotId: EquipSlotIDType): number;

  getSlotOfItem(item: EquipmentItem): EquipSlot | undefined;

  removeQuantityFromSlot(slot: EquipSlot, quantity: number): void;
}

export class EquipSlot {
  id: EquipSlotIDType;
  emptyName: string;
  allowQuantity: boolean;
}

export class EquipmentSet {
  equipment: Equipment;
}

export class SpellSelection {
  ancient?: CombatSpell;

  archaic?: CombatSpell;

  aurora?: CombatSpell;

  curse?: CombatSpell;

  standard: CombatSpell;
}

export class ActivePrayer extends NamespacedObject {
}

export class EquippedFood {
  maxSlots: number;

  selectedSlot: number;

  slots: EquippedFoodSlot[];

  get currentSlot(): EquippedFoodSlot;

  consume(quantity?: number): void;

  equip(item: FoodItem, quantity: number): void;

  unequipSelected(): void;
}

export interface EquippedFoodSlot {
  item: FoodItem;

  quantity: number;
}

export class Player extends Character {
  activePrayers: Set<ActivePrayer>;

  attackType: AttackTypeID;

  equipToSet: number;

  equipmentSets: EquipmentSet[];

  food: EquippedFood;

  prayerPoints: number;

  spellSelection: SpellSelection;

  get equipment(): Equipment;

  get numEquipSets(): number;

  get selectedEquipmentSet(): number;

  addPrayerPoints(amount: number): void;

  changeEquipToSet(setIdx: number): void;

  changeEquipmentSet(setId: number): void;

  consumeItemCharges(event: unknown, interval: unknown): void;

  consumePrayerPoints(amount: number): void;

  disableActivePrayers(): void;

  equipFood(food: Item, quantity: number): void;

  /**
   * @param item
   * @param set
   * @param [slot='Default']
   * @param [quantity=1]
   */
  equipItem(item: EquipmentItem, set: number, slot?: EquipSlot, quantity?: number): void;

  isEquipmentSlotUnlocked(slot: EquipSlot): boolean;

  setAttackStyle(attackType: AttackTypeID, attackStyle: AttackStyle): void;

  toggleAncient(curse: CombatSpell, render?: boolean): void;

  toggleArchaic(curse: CombatSpell, render?: boolean): void;

  toggleAurora(curse: CombatSpell, render?: boolean): void;

  toggleCurse(curse: CombatSpell, render?: boolean): void;

  togglePrayer(prayer: ActivePrayer, render?: boolean): void;

  toggleSpell(curse: CombatSpell, render?: boolean): void;

  unequipItem(set: number, slot?: EquipSlot, quantity?: number): void;
}

export class Character extends NamespacedObject {
}
