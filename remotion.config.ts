import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

// Usa o Chromium da nuvem; em outras máquinas, o navegador padrão do Remotion.
const browser = process.env.REMOTION_BROWSER_EXECUTABLE ??
  ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find(existsSync);
if (browser) Config.setBrowserExecutable(browser);
