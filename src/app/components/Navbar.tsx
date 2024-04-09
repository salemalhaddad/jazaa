'use client'
import React, {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "../../context/AuthContext";
import { Drawer, List, ListItem, ListItemText, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material';
import { blue } from '@mui/icons-material';

export default function Navbar() {
	const { user, googleSignIn, logOut } = UserAuth();
	const [loading, setLoading] = useState(true);
	// const theme = useTheme();
	// const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const handleSignIn = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			console.log(error);
		}
	}

	const handleSignOut = async () => {
		try {
			await logOut();
		} catch (error) {
			console.log(error);
		}
	}

	const [open, setOpen] = React.useState(false);

	const toggle = () => {
		setOpen((prevState) => !prevState);
	};

	useEffect(() => {
		const checkAuthentication = async () => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setLoading(false);
		};
		checkAuthentication();
	}, [user]);

	return (
		<div>
			<nav className="shadow-lg bg-white h-25 flex items-center justify-between px-6">
				{/* Website Logo */}
				<a href="#" className="flex items-center">
					<Image src="/Jazaa.png" alt="Jazaa Logo" width={110} height={110}  />
				</a>

				{/* Primary Navbar items */}
				<div className=" flex space-x-5">
					{loading ? null : !user ? (
						isMobile && (
							<div className="flex space-x-5 m-10">
								<IconButton className="" edge="start" color="inherit" aria-label="menu" onClick={toggle} style={{ color: blue[600] }}>
									<MenuIcon />
								</IconButton>
								<Drawer anchor="right" open={open} onClose={toggle}>
									<List>
										<ListItem button className="font-semibold" onClick={toggle}><ListItemText  primary="How It Works" /></ListItem>
										<ListItem button onClick={toggle}><ListItemText primary="Features" /></ListItem>
										<ListItem button onClick={toggle}><ListItemText primary="FAQ" /></ListItem>
										<ListItem button onClick={handleSignIn}><ListItemText primary="Sign Up" /></ListItem>
									</List>
								</Drawer>
							</div>
						)
					) : (
						<div className="flex items-center">
							<a className="text-blue-700 font-semibold hover:text-blue-500 mr-4 ">Welcome, {user.displayName}</a>
							<a onClick={handleSignOut} className="bg-blue-600 px-4 py-2 rounded font-semibold hover:text-blue-500 transition duration-300">
								Sign Out
							</a>
						</div>
					)}

				</div>

			</nav>


		</div>);
};
