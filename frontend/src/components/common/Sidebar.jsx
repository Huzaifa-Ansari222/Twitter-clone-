import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // Imported useLocation to get the current path
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const location = useLocation(); // Get the current location (path) from react-router
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div className='flex md:flex-[2_2_0] justify-center  w- md:max-w-52 '>
				<div className='fixed md:sticky top-0 md:left-0 flex flex-row justify-evenly items-center md:flex-col border-b-[1px] md:border-none w-screen h-[10vh] md:h-screen md:w-20 z-50 bg-black border-gray-500 '>
			{/* <div className='fixed md:sticky top-0 md:left-0 flex flex-row justify-evenly items-center md:flex-col border-r md:border-none md:border-black w-screen  h-[10vh] md:h-screen md:w-20 z-50 bg-black '> */}
				<Link to='/' className='flex justify-center md:justify-start'>
				<XSvg 
						className={`px-2 w-10 h-10 md:h-12 md:w-12 rounded-full fill-white transition-all duration-300 ${
							location.pathname === '/' ? 'black' : 'hover:bg-stone-900' // Active and hover styles
						}`} 
					/>				</Link>
				<ul className='flex flex-row md:flex-col gap-3 md:mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className={`flex gap-3 items-center  transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer ${
								location.pathname === '/' ? 'bg-[#ffffff14]' : 'hoverbg-[#ffffff14]' // Change: Conditional class for active link
							}`}
						>
							<MdHomeFilled className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className={`flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer ${
								location.pathname === '/notifications' ? 'bg-[#ffffff14]' : 'hover:bg-[#ffffff14]' // Change: Conditional class for active link
							}`}
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block '>Notifications</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className={`flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer ${
								location.pathname === `/profile/${authUser?.username}` ? 'bg-[#ffffff14]' : 'hover:bg-[#ffffff14]' // Change: Conditional class for active link
							}`}
						>
							<FaUser className='w-6 h-5 ' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='md:mt-auto md:mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-2 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="User Avatar" />
							</div>
						</div>
						<div className='flex justify-between flex-1 '>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-6 h-6 cursor-pointer '
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
