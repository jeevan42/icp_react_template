import React, { useState } from 'react';
import i18n from '../../i18n';
import Logo from '../../../assets/icpLogo2.png';

const Navbar = () => {
    const [locale, setLocale ] = useState(i18n.language)
    i18n.on('languageChanged', () => setLocale(i18n.language));
    const handleLangChange = (event) => {
        i18n.changeLanguage(event.target.value);
        window.location.reload();
    }

    return (
        <div className={`flex flex-row h-[95px] w-full justify-center border-0`}>
            <div className='max-w-7xl w-full p-4 flex justify-between items-center'>
                <div className='p-4'>
                    <img src={Logo} alt="Internet Compouter" className='w-64' />
                </div>
                <div>
                    <select id="lang" value={locale} onChange={handleLangChange}>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="fr">French</option>
                        <option value="gr">German</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
