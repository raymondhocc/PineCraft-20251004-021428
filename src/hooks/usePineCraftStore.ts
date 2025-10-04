import { create } from 'zustand';
import { parsePineScript, generateOutputScript, PineParameter } from '@/lib/pine-parser';
const PINE_SCRIPT_PLACEHOLDER = `//@version=5
strategy("My EMA Cross Strategy", overlay=true)
// EMA Inputs
ema_fast_len = input.int(9, title="Fast EMA Length", minval=1, maxval=100, step=1, tooltip="Length for the fast moving average.")
ema_slow_len = input.int(21, title="Slow EMA Length", minval=1, maxval=200, step=1, tooltip="Length for the slow moving average.")
// Trade Size
trade_size = input.float(0.1, "Trade Size (BTC)", minval=0.01, maxval=1, step=0.01)
// Strategy Direction
enable_longs = input.bool(true, "Enable Long Trades")
enable_shorts = input.bool(false, "Enable Short Trades")
// Source
price_source = input.source(close, "Price Source")
// --- Logic ---
fast_ema = ta.ema(price_source, ema_fast_len)
slow_ema = ta.ema(price_source, ema_slow_len)
plot(fast_ema, "Fast EMA", color=color.blue)
plot(slow_ema, "Slow EMA", color=color.orange)
long_condition = ta.crossover(fast_ema, slow_ema)
short_condition = ta.crossunder(fast_ema, slow_ema)
if (long_condition and enable_longs)
    strategy.entry("Long", strategy.long, qty=trade_size)
if (short_condition and enable_shorts)
    strategy.entry("Short", strategy.short, qty=trade_size)
`;
interface PineCraftState {
  inputScript: string;
  parameters: PineParameter[];
  parameterValues: Record<string, any>;
  outputScript: string;
  actions: {
    setInputScript: (script: string) => void;
    setParameterValue: (name: string, value: any) => void;
    reset: () => void;
  };
}
const usePineCraftStore = create<PineCraftState>((set, get) => {
  const initialParams = parsePineScript(PINE_SCRIPT_PLACEHOLDER);
  const initialValues: Record<string, any> = {};
  initialParams.forEach(p => {
    initialValues[p.name] = p.defval;
  });
  const initialOutputScript = generateOutputScript(PINE_SCRIPT_PLACEHOLDER, initialParams, initialValues);

  return {
    inputScript: PINE_SCRIPT_PLACEHOLDER,
    parameters: initialParams,
    parameterValues: initialValues,
    outputScript: initialOutputScript,
    actions: {
      setInputScript: (script) => {
        try {
        const params = parsePineScript(script);
        const newValues: Record<string, any> = {};
        params.forEach(p => {
          newValues[p.name] = p.defval;
        });
        const newOutputScript = generateOutputScript(script, params, newValues);
        set({
          inputScript: script,
          parameters: params,
          parameterValues: newValues,
          outputScript: newOutputScript,
        });
      } catch (error) {
        console.error("Failed to parse Pine Script:", error);
        set({
          inputScript: script,
          parameters: [],
          parameterValues: {},
          outputScript: script, // Show original script on error
        });
        }
      },
      setParameterValue: (name, value) => {
        const newValues = { ...get().parameterValues, [name]: value };
        const newOutputScript = generateOutputScript(
          get().inputScript,
          get().parameters,
          newValues
        );
        set({
          parameterValues: newValues,
          outputScript: newOutputScript,
        });
      },
      reset: () => {
        const script = get().inputScript;
        get().actions.setInputScript(script);
      },
    },
  };
});
export const useInputScript = () => usePineCraftStore((state) => state.inputScript);
export const useParameters = () => usePineCraftStore((state) => state.parameters);
export const useParameterValues = () => usePineCraftStore((state) => state.parameterValues);
export const useOutputScript = () => usePineCraftStore((state) => state.outputScript);
export const usePineCraftActions = () => usePineCraftStore((state) => state.actions);
export default usePineCraftStore;