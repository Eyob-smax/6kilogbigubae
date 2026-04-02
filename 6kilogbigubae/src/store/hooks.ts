import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store'; // Adjust path if needed

export const useAppDispatch: () => AppDispatch = useDispatch;
