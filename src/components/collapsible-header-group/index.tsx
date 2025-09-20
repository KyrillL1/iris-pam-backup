import { IconButton, styled } from "@mui/material";
import {
	GridColumnGroupHeaderParams,
	gridColumnVisibilityModelSelector,
	useGridApiContext,
	useGridSelector,
} from "@mui/x-data-grid";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ColumnGroupRoot = styled("div")({
	overflow: "hidden",
	display: "flex",
	alignItems: "center",
});

const ColumnGroupTitle = styled("span")({
	overflow: "hidden",
	textOverflow: "ellipsis",
});

export function CollapsibleHeaderGroup({
	groupId,
	headerName,
	collapseFields = [],
}: GridColumnGroupHeaderParams & { collapseFields: string[] }) {
	const apiRef = useGridApiContext();
	const columnVisibilityModel = useGridSelector(
		apiRef,
		gridColumnVisibilityModelSelector,
	);

	if (!groupId) {
		return null;
	}

	const isGroupCollapsed = collapseFields.every((field) =>
		columnVisibilityModel[field] === false
	);

	return (
		<ColumnGroupRoot>
			<ColumnGroupTitle>{headerName ?? groupId}</ColumnGroupTitle>
			<IconButton
				sx={{ ml: 0.5 }}
				onClick={() => {
					const newModel = { ...columnVisibilityModel };
					collapseFields.forEach((field) => {
						newModel[field] = !!isGroupCollapsed;
					});
					apiRef.current.setColumnVisibilityModel(newModel);
				}}
			>
				{isGroupCollapsed
					? (
						<KeyboardArrowRightIcon
							fontSize="small"
							sx={{ color: "white" }}
						/>
					)
					: (
						<KeyboardArrowDownIcon
							fontSize="small"
							sx={{ color: "white" }}
						/>
					)}
			</IconButton>
		</ColumnGroupRoot>
	);
}
