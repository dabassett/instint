import { createContext } from "react";

// every display element depends on the color palette, and providing that
//  as a react context both reduces boilerplate (DRY) and improves modularity by
//  establishing one convention to set different palettes
export const PaletteContext = createContext(null);
