import { Select, Tag, Wrap, WrapItem } from '@chakra-ui/react';

// 미리 정의된 카테고리
export const CATEGORIES = [
  { value: 'health', label: '건강', color: 'green' },
  { value: 'study', label: '공부', color: 'blue' },
  { value: 'work', label: '업무', color: 'purple' },
  { value: 'hobby', label: '취미', color: 'orange' },
  { value: 'social', label: '관계', color: 'pink' },
  { value: 'etc', label: '기타', color: 'yellow' }
];

function CategorySelect({ value, onChange, isFilter }) {
  return isFilter ? (
    <Wrap spacing={2}>
      <WrapItem>
        <Tag
          cursor="pointer"
          colorScheme={value === 'all' ? 'blue' : 'gray'}
          onClick={() => onChange('all')}
        >
          전체
        </Tag>
      </WrapItem>
      {CATEGORIES.map(category => (
        <WrapItem key={category.value}>
          <Tag
            cursor="pointer"
            colorScheme={value === category.value ? category.color : 'gray'}
            onClick={() => onChange(category.value)}
          >
            {category.label}
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  ) : (
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      {CATEGORIES.map(category => (
        <option key={category.value} value={category.value}>
          {category.label}
        </option>
      ))}
    </Select>
  );
}

export default CategorySelect;