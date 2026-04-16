import logo from '@/assets/logo.svg';

export default function AppLogo() {
    return (
        <div className="flex items-center justify-center">
            <img src={logo} alt="ClientKosmos" className="size-20 object-contain" />
        </div>
    );
}
