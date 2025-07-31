import {Fragment} from 'preact';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {defineOption} from '../lib/define-option.mjs';
import {EMPTY_ARR} from '../lib/util.mjs';
import {resolveDynamicOptionObject} from '../lib/util/dynamic-option.mjs';
import {isUndefinedOr, typeIs} from '../lib/util/type-is.mjs';
import type {NumberNodeOption} from '../public_api';
import {useRenderEditTouch} from './_common.mjs';

defineOption<number, NumberNodeOption>({
  is(v): v is NumberNodeOption {
    const {type, max, min, placeholder, step} = v as Partial<NumberNodeOption>;

    return type === Number
      && (min == null || typeIs(min, 'number', 'function'))
      && (max == null || typeIs(max, 'number', 'function'))
      && isUndefinedOr(placeholder, 'string')
      && isUndefinedOr(step, 'number');
  },
  renderEdit({
    option: {max, min, placeholder, step},
    value,
    onChange,
    otherValues,
  }) {
    const onBlur = useRenderEditTouch();
    const [inputValue, setInputValue] = useState<string>('');
    
    // Initialize input value when component mounts or value changes
    useEffect(() => {
      setInputValue(value?.toString() ?? '');
    }, [value]);
    
    const onInp = useCallback((e: Event) => {
      const newVal = (e.target as HTMLInputElement).value;
      setInputValue(newVal);
      
      const asNum = parseFloat(newVal);
      
      if (isNaN(asNum)) {
        onChange(undefined);
      } else if (newVal.endsWith('.') || newVal === '') {
        // Don't update the actual value yet, just keep the string
        return;
      } else {
        onChange(asNum);
      }
    }, [onChange]);

    return (
      <input
        class={'form-control form-control-sm'}
        type={'number'}
        onBlur={onBlur}
        value={inputValue}
        onInput={onInp}
        placeholder={placeholder ?? ''}
        max={resolveDynamicOptionObject(max, otherValues) ?? ''}
        min={resolveDynamicOptionObject(min, otherValues) ?? ''}
        step={step ?? ''}/>
    );
  },
  renderView: ({value}) => (<Fragment>{value?.toLocaleString()}</Fragment>),
  token: Number,
  validate(value: number | undefined, {max: rMax, min: rMin}: NumberNodeOption, otherValues): string[] {
    if (value == null) {
      return EMPTY_ARR;
    }

    const out: string[] = [];

    let check = resolveDynamicOptionObject(rMin, otherValues);
    if (check != null && value < check) {
      out.push(`Min value: ${check.toLocaleString()}`);
    }

    check = resolveDynamicOptionObject(rMax, otherValues);
    if (check != null && value > check) {
      out.push(`Max value: ${check.toLocaleString()}`);
    }

    return out.length ? out : EMPTY_ARR;
  },
});
