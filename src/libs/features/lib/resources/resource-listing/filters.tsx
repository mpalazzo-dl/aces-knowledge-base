"use client";

import MuiMenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";

import { articleListingDisplayTypes, useResourcesState } from "@aces/store";
import { CfResourceCategory, ResourceFileKind } from "@aces/types";
import { palette, shape, spacing, typography } from "@aces/theme";
import {
  Icon,
  IconButton,
  InputAdornment,
  OutlinedInput,
  ScrollBox,
  ToggleButton,
  ToggleButtonGroup,
} from "@aces/ui";

import { ResourceOrderTypes } from "../config";
import { FileKindMeta } from "../file-kind";
import { ResourceLabels } from "../labels";

export const AllValue = "all";

interface ResourceSearchProps {
  value: string;
  onChange: (value: string) => void;
  labels: ResourceLabels;
}

export const ResourceSearch = ({
  value,
  onChange,
  labels,
}: ResourceSearchProps) => (
  <OutlinedInput
    id="resource-search"
    fullWidth
    value={value}
    placeholder={labels.searchPlaceholder}
    onChange={(event) => onChange(event.target.value)}
    inputProps={{ "aria-label": labels.searchPlaceholder }}
    startAdornment={
      <InputAdornment position="start">
        <Icon icon="Search" size={22} color={palette.grey[500]} />
      </InputAdornment>
    }
    endAdornment={
      value ? (
        <InputAdornment position="end">
          <IconButton
            size="small"
            aria-label={labels.clearFilters}
            onClick={() => onChange("")}
          >
            <Icon icon="Close" size={18} />
          </IconButton>
        </InputAdornment>
      ) : undefined
    }
  />
);

interface TypeFilterProps {
  value: string;
  counts: Partial<Record<ResourceFileKind, number>>;
  total: number;
  kinds: ResourceFileKind[];
  onChange: (value: string) => void;
  labels: ResourceLabels;
}

export const TypeFilter = ({
  value,
  counts,
  total,
  kinds,
  onChange,
  labels,
}: TypeFilterProps) => (
  <ScrollBox>
    <ToggleButtonGroup value={value} style={{ marginX: -buttonToggleSpacing }}>
      <FilterToggleButton
        value={AllValue}
        selected={value === AllValue}
        onChange={onChange}
      >
        {labels.allTypes}
        <strong style={{ marginLeft: "6px" }}>{total}</strong>
      </FilterToggleButton>
      {kinds.map((kind) => (
        <FilterToggleButton
          key={kind}
          value={kind}
          selected={value === kind}
          onChange={onChange}
        >
          <Icon
            icon={FileKindMeta[kind].icon}
            size={16}
            style={{ marginRight: "6px" }}
          />
          {labels.kinds[kind]}
          <strong style={{ marginLeft: "6px" }}>{counts[kind] || 0}</strong>
        </FilterToggleButton>
      ))}
    </ToggleButtonGroup>
  </ScrollBox>
);

interface CategoryFilterProps {
  value: string;
  categories: (CfResourceCategory & { count: number })[];
  onChange: (value: string) => void;
  labels: ResourceLabels;
}

export const CategoryFilter = ({
  value,
  categories,
  onChange,
  labels,
}: CategoryFilterProps) => (
  <ScrollBox>
    <ToggleButtonGroup value={value} style={{ marginX: -buttonToggleSpacing }}>
      <FilterToggleButton
        value={AllValue}
        selected={value === AllValue}
        onChange={onChange}
        subtle
      >
        {labels.allCategories}
      </FilterToggleButton>
      {categories.map((category) => (
        <FilterToggleButton
          key={category.slug}
          value={category.slug}
          selected={value === category.slug}
          onChange={onChange}
          subtle
        >
          {category.title}
          <strong style={{ marginLeft: "6px" }}>{category.count}</strong>
        </FilterToggleButton>
      ))}
    </ToggleButtonGroup>
  </ScrollBox>
);

interface SortSelectProps {
  value: ResourceOrderTypes;
  onChange: (value: ResourceOrderTypes) => void;
  labels: ResourceLabels;
}

export const SortSelect = ({ value, onChange, labels }: SortSelectProps) => (
  <MuiSelect
    size="small"
    value={value}
    onChange={(event) => onChange(event.target.value as ResourceOrderTypes)}
    inputProps={{ "aria-label": labels.sortLabel }}
    sx={{ minWidth: 140, backgroundColor: palette.common.white }}
  >
    <MuiMenuItem value={ResourceOrderTypes.Newest}>
      {labels.sort.newest}
    </MuiMenuItem>
    <MuiMenuItem value={ResourceOrderTypes.Oldest}>
      {labels.sort.oldest}
    </MuiMenuItem>
    <MuiMenuItem value={ResourceOrderTypes.Title}>
      {labels.sort.title}
    </MuiMenuItem>
    <MuiMenuItem value={ResourceOrderTypes.Type}>
      {labels.sort.type}
    </MuiMenuItem>
  </MuiSelect>
);

export const DisplayToggle = () => {
  const { resourceListingDisplay, setResourceListingDisplay } =
    useResourcesState();

  const options: {
    value: articleListingDisplayTypes;
    icon: "Apps" | "FormatListBulleted";
  }[] = [
    { value: "grid", icon: "Apps" },
    { value: "list", icon: "FormatListBulleted" },
  ];

  return (
    <ToggleButtonGroup value={resourceListingDisplay}>
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          selected={resourceListingDisplay === option.value}
          onChange={() => setResourceListingDisplay(option.value)}
          style={{
            borderRadius: shape.borderRadius,
            border: `1px solid ${palette.border.default} !important`,
            width: "40px",
            height: "40px",
            "&.Mui-selected, &.Mui-selected:hover": {
              color: palette.primary.main,
              background: palette.common.white,
            },
          }}
        >
          <span
            role="img"
            aria-label={option.value}
            style={{ display: "flex" }}
          >
            <Icon icon={option.icon} size={20} />
          </span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const buttonToggleSpacing = 2.5;

interface FilterToggleButtonProps {
  value: string;
  selected: boolean;
  subtle?: boolean;
  children: React.ReactNode;
  onChange: (value: string) => void;
}

const FilterToggleButton = ({
  value,
  selected,
  subtle = false,
  children,
  onChange,
}: FilterToggleButtonProps) => (
  <ToggleButton
    value={value}
    selected={selected}
    onChange={() => onChange(value)}
    style={{
      borderRadius: `${shape.borderRadius * spacing}px !important`,
      border: `1px solid ${palette.border.default} !important`,
      color: palette.text.primary,
      marginX: buttonToggleSpacing,
      textTransform: "none",
      fontSize: typography.caption2,
      padding: subtle ? 2 : 2.5,
      whiteSpace: "nowrap",
      "&.Mui-selected, &.Mui-selected:hover": {
        background: subtle ? palette.grey[800] : palette.primary.main,
        borderColor: `${subtle ? palette.grey[800] : palette.primary.main} !important`,
        color: palette.primary.contrastText,
      },
      "&:focus": {
        outline: "1px solid -webkit-focus-ring-color",
      },
    }}
  >
    {children}
  </ToggleButton>
);
