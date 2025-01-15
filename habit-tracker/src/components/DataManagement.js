import {
    Button,
    HStack,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    Text,
    Input,
    FormControl,
    FormLabel,
    useDisclosure,
  } from '@chakra-ui/react';
  import { 
    DownloadIcon, 
    AttachmentIcon  // 또는 AddIcon이나 PlusSquareIcon 사용 가능
  } from '@chakra-ui/icons';
  import { useRef } from 'react';
  import { routineApi } from '../services/api';

  function DataManagement({ routines, onImport }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInputRef = useRef();
    const toast = useToast();
  
    const handleExport = () => {
      const data = JSON.stringify(routines, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `routines_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  
      toast({
        title: '데이터가 내보내기되었습니다.',
        status: 'success',
        duration: 2000,
      });
    };
  
    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const reader = new FileReader();
            reader.onload = async (e) => {
              try {
                const routines = JSON.parse(e.target.result);
                
                // 백엔드에 데이터 전송
                const response = await routineApi.importRoutines(routines);
                
                toast({
                  title: '데이터 가져오기 완료',
                  description: `${response.data.imported}개의 루틴이 추가되었습니다.
                              ${response.data.skipped.length}개의 중복 루틴이 건너뛰어졌습니다.`,
                  status: 'success',
                  duration: 3000,
                });
                
                // 화면 새로고침
                window.location.reload();
                
              } catch (error) {
                console.error('Import error:', error);
                toast({
                  title: '데이터 가져오기 실패',
                  description: error.response?.data?.detail || error.message,
                  status: 'error',
                  duration: 2000,
                });
              }
            };
            reader.readAsText(file);
          } catch (error) {
            console.error('File reading error:', error);
            toast({
              title: '파일 읽기 실패',
              description: error.message,
              status: 'error',
              duration: 2000,
            });
          }
        }
      };
  
    return (
      <>
        <HStack spacing={4}>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            데이터 내보내기
          </Button>
          <Button
            leftIcon={<AttachmentIcon />}
            colorScheme="green"
            variant="outline"
            size="sm"
            onClick={onOpen}
          >
            데이터 가져오기
          </Button>
        </HStack>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>데이터 가져오기</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text color="gray.600" fontSize="sm">
                  이전에 내보내기한 JSON 파일을 선택해주세요.
                </Text>
                <FormControl>
                  <FormLabel>파일 선택</FormLabel>
                  <Input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleImport}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
  
  export default DataManagement;