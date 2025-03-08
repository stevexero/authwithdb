import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='w-full flex items-center justify-center mt-8'>
      <Link
        href='https://github.com/stevexero/authwithdb?tab=readme-ov-file'
        target='_blank'
        className='flex items-center text-white'
      >
        <FaGithub size='2rem' />
      </Link>
    </div>
  );
};

export default Footer;
