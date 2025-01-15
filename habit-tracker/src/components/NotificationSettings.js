import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Switch,
    Input,
    VStack,
    Button,
    useToast
  } from '@chakra-ui/react';
  import { useState } from 'react';
  
  function NotificationSettings({ isOpen, onClose, routine, onUpdate }) {
    const [enabled, setEnabled] = useState(routine.notification?.enabled || false);
    const [time, setTime] = useState(routine.notification?.time || '09:00');
    const toast = useToast();
  
    const handleSave = () => {
      if (enabled && !('Notification' in window)) {
        toast({
          title: '알림이 지원되지 않는 브라우저입니다.',
          status: 'error',
          duration: 3000,
        });
        return;
      }
  
      if (enabled) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            onUpdate(routine.id, {
              ...routine,
              notification: { enabled, time }
            });
            onClose();
            toast({
              title: '알림이 설정되었습니다.',
              status: 'success',
              duration: 2000,
            });
          } else {
            toast({
              title: '알림 권한이 필요합니다.',
              status: 'error',
              duration: 3000,
            });
          }
        });
      } else {
        onUpdate(routine.id, {
          ...routine,
          notification: { enabled, time }
        });
        onClose();
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>알림 설정</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>알림 활성화</FormLabel>
                <Switch
                  isChecked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
              </FormControl>
  
              <FormControl>
                <FormLabel>알림 시간</FormLabel>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  isDisabled={!enabled}
                />
              </FormControl>
  
              <Button colorScheme="blue" onClick={handleSave} w="full">
                저장
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  
  export default NotificationSettings;