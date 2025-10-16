import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { CustomButton } from '../components';
import { Link } from 'react-router-dom';

import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion';

const Home = () => {
    const snap = useSnapshot(state);
    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.section className='home' {...slideAnimation('left')}>
                    <motion.header {...slideAnimation('down')}>
                        {/* Flexbox használata a logó középre igazításához */}
                       
                            <motion.div 
                                key="logo"
                                initial={{ opacity: 1 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} // Animáció, hogy a logó eltűnjön
                                transition={{ duration: 0.2 }} // Animáció időtartama
                            >
                                <Link to="localhost:3000">
                                    <img 
                                        src='./logo.png' 
                                        alt='logo' 
                                        className='object-contain w-32 h-32'  // Itt állíthatod a logó méretét
                                    />
                                </Link>
                            </motion.div>
                        
                    </motion.header>

                    <motion.div className='home-content' {...headContainerAnimation}>
                        <motion.div {...headTextAnimation}>
                            <h1 className='head-text'>
                                3D-S <br className='hidden xl:block' />DESIGN.
                            </h1>
                        </motion.div>
                        <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                            <p className='max-w-md text-base font-normal text-gray-600'>
                               Készítsd el a saját, egyedi és exkluzív pólódat vadonatúj 3D testreszabó eszközünkkel. Engedd szabadjára a <strong>fantáziád</strong>, és alakítsd ki a saját stílusod.
                            </p>

                            <CustomButton 
                                type="filled" 
                                title="Szerkesztés" 
                                handleClick={() => state.intro = false}
                                customStyles="w-fit px-4 py-2.5 font-bold text-smm" 
                            />
                        </motion.div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}

export default Home;
