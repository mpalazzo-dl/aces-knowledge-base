import { create } from "zustand";

import {
  articleListingDisplayTypes,
  DisplayTypeDefault,
} from "./articles-store";

interface ResourcesState {
  resourceListingDisplay: articleListingDisplayTypes;
  setResourceListingDisplay: (displayType: articleListingDisplayTypes) => void;
}

export const useResourcesState = create<ResourcesState>((set) => ({
  resourceListingDisplay: DisplayTypeDefault,
  setResourceListingDisplay: (displayType) =>
    set({ resourceListingDisplay: displayType }),
}));
