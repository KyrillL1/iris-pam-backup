import { useCallback, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Download, OpenInNew } from "@mui/icons-material";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { useHandleError } from "@utils/use-handle-error";

export const PayslipCell: React.FC<{ path: string; fileName?: string }> = (
	{ path, fileName },
) => {
	const [url, setUrl] = useState<string | null>(null);

	const { handleError } = useHandleError();

	useEffect(() => {
		let active = true;

		async function fetchUrl() {
			if (!path) return;

			const { data, error } = await supabaseBrowserClient
				.storage
				.from("payslips")
				.createSignedUrl(path, 3600);

			if (error) {
				handleError(error, { hideFromUser: true });
			}

			if (active && data?.signedUrl) {
				setUrl(data.signedUrl);
			}
		}

		fetchUrl();

		return () => {
			active = false;
		};
	}, [path]);

	const handleDownload = useCallback(async () => {
		const { data, error } = await supabaseBrowserClient
			.storage
			.from("payslips")
			.download(path);

		if (error) {
			handleError(error, { hideFromUser: true });
		}

		if (data) {
			const url = URL.createObjectURL(data);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName || path.split("/").pop() || "file.pdf";
			a.click();
			URL.revokeObjectURL(url);
		}
	}, [path, fileName]);

	if (!url) return null;

	return (
		<>
			<IconButton
				size="small"
				component="a"
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				<OpenInNew />
			</IconButton>
			<IconButton
				size="small"
				onClick={handleDownload}
			>
				<Download />
			</IconButton>
		</>
	);
};
