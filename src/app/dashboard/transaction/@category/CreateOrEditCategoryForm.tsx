'use client';

import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { CategoryWrapped, RuleKeys, presetColors } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CreateOrEditCategoryFormProps {
  category?: CategoryWrapped;
}

const defaultValue = {
  id: -1,
  name: '',
  color: '#fff',
  label: '',
  rules: [],
};

export function CreateOrEditCategoryForm({ category }: CreateOrEditCategoryFormProps) {
  const [input, setInput] = useState<CategoryWrapped>(category ?? defaultValue);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const router = useRouter();

  const labelCssPlaceholder = 'text-sm inline-block w-12';
  const inputCssPlaceholder = 'focus:outline-none px-1 py-0.5 font-normal';

  const plusButtonCss = 'inline-block px-10 bg-half-dark-green/20 hover:bg-half-dark-green/50';

  useEffect(() => {
    if (input.id !== category?.id) {
      setInput(category ?? defaultValue);
    }
  }, [input.id, category]);

  const clear = () => {
    setInput(category ?? defaultValue);
  };

  const request = async () => {
    if (input.id === -1) {
      // create
      const res = await fetch('/api/category', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } else {
      // edit
      const res = await fetch('/api/category', {
        method: 'PUT',
        body: JSON.stringify(input),
      });
    }

    setInput(defaultValue);
    router.refresh();
  };

  return (
    <div>
      <div className='mb-2'>
        <div>
          <label className={classNames(labelCssPlaceholder)}>Name</label>
          <input className={inputCssPlaceholder} type='text' value={input.name} onChange={x => setInput({
            ...input,
            name: x.target.value,
          })} />
        </div>
        <div>
          <label className={classNames(labelCssPlaceholder)}>Label</label>
          <input className={inputCssPlaceholder} type='text' value={input.label} onChange={x => setInput({
            ...input,
            label: x.target.value,
          })} />
        </div>
        <div>
          <label className={classNames(labelCssPlaceholder)}>Color</label>
          <div className='inline-block w-32 h-7 cursor-pointer' onClick={() => setShowColorPicker(!showColorPicker)}>
            <div style={{
              display: 'inline-block',
              backgroundColor: input.color,
              width: '100%',
              height: '100%',
            }} />
          </div>
          {
            showColorPicker && (
              <div className='absolute z-10'>
                <div className='fixed inset-0' onClick={() => setShowColorPicker(false)} />
                <SketchPicker color={input.color} disableAlpha={true} presetColors={presetColors} onChange={x => setInput({
                  ...input,
                  color: x.hex,
                })} />
              </div>
            )
          }
        </div>

        <div>
          <label className={classNames(labelCssPlaceholder)} htmlFor='rules'>
            Rules
          </label>
          <button onClick={() => setInput({
            ...input,
            rules: [...input.rules, {
              pairs: [],
            }],
          })} className={plusButtonCss}>+</button>
          <div>
            {
              input.rules.map((x, i) => (
                <div key={`rule:${i}`} className='flex flex-row'>
                  <button onClick={() => setInput({
                    ...input,
                    rules: input.rules.filter((y, j) => j !== i),
                  })} className='w-3 mr-1 my-0.5 text-half-red text-sm bg-half-dark-red/40'>
                    -
                  </button>
                  <div>
                    <label className={classNames(labelCssPlaceholder)} htmlFor='pairs'>
                      Pairs
                    </label>
                    <button onClick={() => setInput({
                      ...input,
                      rules: input.rules.map((y, j) => j === i ? {
                        ...y,
                        pairs: [...y.pairs, {
                          key: '',
                          value: '',
                        }],
                      } : y),
                    })} className={plusButtonCss}>+</button>
                    <div>
                      {
                        x.pairs.map((y, j) => (
                          <div key={`pair:${j}`} className='flex flex-row'>

                            <button onClick={() => setInput({
                              ...input,
                              rules: input.rules.map((w, k) => k === i ? {
                                ...w,
                                pairs: w.pairs.filter((v, l) => l !== j),
                              } : w),
                            })} className='w-3 mr-1 my-0.5 text-half-red text-sm bg-half-dark-red/40'>
                              -
                            </button>

                            <div>
                              <div>
                                <label className={labelCssPlaceholder} htmlFor='key'>Key</label>
                                <select className={inputCssPlaceholder} value={y.key} onChange={z => setInput({
                                  ...input,
                                  rules: input.rules.map((w, k) => k === i ? {
                                    ...w,
                                    pairs: w.pairs.map((v, l) => l === j ? {
                                      ...v,
                                      key: z.target.value,
                                    } : v),
                                  } : w),
                                })}>
                                  {
                                    RuleKeys.map(x => (
                                      <option key={x} value={x}>{x}</option>
                                    ))
                                  }
                                </select>
                              </div>
                              <div>
                                <label className={labelCssPlaceholder} htmlFor='value'>Value</label>
                                <input className={inputCssPlaceholder} type='text' value={y.value} onChange={z => setInput({
                                  ...input,
                                  rules: input.rules.map((w, k) => k === i ? {
                                    ...w,
                                    pairs: w.pairs.map((v, l) => l === j ? {
                                      ...v,
                                      value: z.target.value,
                                    } : v),
                                  } : w),
                                })} />
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div>
        <button className='w-full bg-half-dark-green/50 hover:bg-half-dark-green/70 py-1' onClick={request}>
          {input?.id === -1 ? 'Create' : 'Update'}
        </button>
      </div>
    </div>
  )
}