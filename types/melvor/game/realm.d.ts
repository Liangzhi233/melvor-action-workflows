// noinspection JSUnusedGlobalSymbols

import type {NamespacedObject} from './core';
import type {Requirement} from './misc';

export class Realm extends NamespacedObject {
  unlockRequirements: Requirement[];
  
  _name: string;
  _media: string;
  showIfLocked: boolean;
  ignoreCompletion: boolean;
  sidebarClass?: string;
  realmClass: string;
  modQuery: any; // ModifierQuery

  get name(): string;
  get media(): string;
  get isUnlocked(): boolean;

  registerSoftDependencies(data: any, game: any): void;
}

export class RealmedObject extends NamespacedObject {
  realm: Realm;
} 