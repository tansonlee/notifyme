import { Box, Button, Flex, Input, useClipboard, Text, Icon, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { successToast } from '../lib/toast';
import { BiShow, BiHide } from 'react-icons/bi';

export const HidableCopyableText = ({ text }: { text: string }) => {
	const [show, setShow] = useState(false);
	const { onCopy } = useClipboard(text);

	const handleCopyText = () => {
		onCopy();
		successToast({ description: 'Copied to clipboard!' });
	};

	return (
		<Flex>
			<Flex position='relative' bgColor='#eee' padding={2} borderRadius='md' w='25rem'>
				<Text fontFamily='mono'>{show ? text : hideText(text)}</Text>
				<IconButton
					icon={<MdContentCopy />}
					size='sm'
					borderRadius='3xl'
					colorScheme='blackAlpha'
					onClick={handleCopyText}
					position='absolute'
					right={2}
					top='50%'
					transform='translateY(-50%)'
					aria-label='Copy text'
				/>
			</Flex>
			<IconButton
				aria-label='Show text'
				icon={<Icon as={show ? BiHide : BiShow} fontSize='xl' />}
				onClick={() => setShow(prev => !prev)}
				variant='ghost'
				borderRadius='3xl'
			/>
		</Flex>
	);
};

// return text with only the last 4 characters visible
const hideText = (text: string) => {
	return text.slice(0, -4).replace(/./g, '*') + text.slice(-4);
};
