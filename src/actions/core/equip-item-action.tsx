import type {EquipmentItem as TEquipmentItem} from 'melvor';
import {EquipSlotType} from 'melvor';
import {Fragment} from 'preact';
import {InternalCategory} from '../../lib/registries/action-registry.mjs';
import {defineLocalAction} from '../../lib/util/define-local.mjs';
import {BigNum} from '../../ui/components/big-num';
import {RenderNodeMedia} from '../../ui/pages/workflows-dashboard/render-node-media';
import ActionId from '../action-id.mjs';

interface Props {
  item: TEquipmentItem;

  qty?: number;

  slot?: EquipSlotType;
}

defineLocalAction<Props>({
  category: InternalCategory.CORE,
  compactRender: ({item, qty, slot}) => (
    <Fragment>
      <span>{'Equip '}</span>
      {qty != null && (
        <Fragment>
          <BigNum num={qty}/>
          <span>{' '}</span>
        </Fragment>
      )}
      <RenderNodeMedia label={item.name} media={item.media}/>
      {slot && (
        <Fragment>
          <span>{' to '}</span>
          <span class={'text-primary'}>{slot}</span>
        </Fragment>
      )}
    </Fragment>
  ),
  description: 'Equip an item. You can set a slot & the equip amount when applicable.',
  execute({item, qty, slot}) {
    const bankQty = game.bank.getQty(item);
    if (!bankQty) {
      return;
    }

    
    const player = game.combat.player;
    const validSlot = slot ? game.equipmentSlots.getObjectByID(slot) : item.validSlots[0];
    player.changeEquipToSet(player.selectedEquipmentSet);
    player.equipItem(item, player.equipToSet, validSlot, qty ?? bankQty);
  },
  id: ActionId.CoreEquipItem,
  label: 'Equip item',
  media: game.items.getObjectByID('melvorD:Black_Platebody')!.media,
  options: [
    {
      id: 'item',
      label: 'Item',
      mediaFilter: item => item instanceof EquipmentItem,
      registry: 'items',
      required: true,
      type: 'MediaItem',
    },
    {
      description: 'Leave empty to use the item\'s default, e.g. a ring with a passive effect would get equipped to the ring slot. If you\'re equipping two summons, specify the slot for each.',
      enum: ({item}: Props) => {
        return Object.fromEntries(
          item.validSlots
            .filter(x => game.combat.player.isEquipmentSlotUnlocked(x))
            .map(x => [x.id, x.emptyName])
        );
      },
      id: 'slot',
      label: 'Slot',
      showIf: ({item}: Partial<Props>) => {
        return (item?.validSlots?.filter(x => game.combat.player.isEquipmentSlotUnlocked(x))?.length ?? 0) > 1;
      },
      type: String,
    },
    {
      description: 'Equips however much you have in the bank if unspecified & supported.',
      id: 'qty',
      label: 'Quantity',
      min: 1,
      showIf: ({item}: Partial<Props>) => item?.validSlots[0]?.allowQuantity ?? false,
      type: Number,
    },
  ],
});
