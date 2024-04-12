'use client'

import * as Frigade from '@frigade/react';
import { useState } from'react';

const FRIGADE_API_KEY = "api_public_7d1ybWu2ZunHuIfjK8qZWRrSkVyWuTu52WM7N1eKG2IFDeQCEkTVZGMdZNvCUZQX";

export default function Page() {


	return (
		<div>
			<div>
				<Frigade.Provider apiKey={FRIGADE_API_KEY}>
					<Frigade.Form
						flowId="flow_Bc6WjrkE"
						dismissible={false}

					/>
				</Frigade.Provider>
			</div>
		</div>
	);
};

