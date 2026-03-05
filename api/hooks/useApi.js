import { useMutation, useQuery, useQueryClient, useInfiniteQuery, Mutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { requestOtp, verifyOtp, stats, getBranch, findavailableroom, mybookinghome, bookroom, explorerooms, bookings, allbooking } from "../api";
import { use } from "react";

export const useRequestOtp = () => {
    return useMutation({
        mutationFn: requestOtp,
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'OTP sent successfully',
                text2: data.message,
            });
            console.log("OTP sent successfully", data);
        },
        onError: (error) => {
            const msg = error.response?.data?.detail || error.message || 'Failed to send OTP';
            Toast.show({
                type: 'error',
                text1: 'OTP Error',
                text2: msg,
            });
            console.log("Error sending OTP", msg);
        }
    });
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'OTP verified successfully',
                text2: data.message,
            });
            console.log("OTP verified successfully", data);
        },
        onError: (error) => {
            const msg = error.response?.data?.detail;
            Toast.show({
                type: 'error',
                text1: 'OTP Error',
                text2: msg,
            });
            console.log("Error verifying OTP", msg);
        }
    });
}

export const useStats = () => {
    return useQuery({
        queryKey: ['stats'],
        queryFn: stats,
    });
}

export const useBranch = () => {
    return useQuery({
        queryKey: ['branch'],
        queryFn: getBranch,
    })
}

export const useFindAvailableRoom = () => {
    return useMutation({
        mutationFn: findavailableroom,
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'Rooms found successfully',
                text2: data.message,
            });
            console.log("Rooms found successfully", data);
        },
        onError: (error) => {
            const msg = error.response?.data?.detail;
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: msg,
            });
            console.log("Error finding rooms", msg);
        }
    })
}

export const useMyBookingHome = () => {
    return useQuery({
        queryKey: ['my-bookings'],
        queryFn: mybookinghome,
    })
}

export const useBookRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bookroom,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['my-bookings', 'stats'] });
            Toast.show({
                type: 'success',
                text1: 'Room booked successfully',
                text2: data.message,
            });
            console.log("Room booked successfully", data);
        },
        onError: (error) => {
            const msg = error.response?.data?.detail;
            Toast.show({
                type: 'error',
                text1: 'Booking Error',
                text2: msg,
            });
            console.log("Error booking room", msg);
        }
    })
}

export const useExploreRooms = (status) => {
    return useQuery({
        queryKey: ['explore-rooms', status],
        queryFn: () => explorerooms(status),
    })
}

export const useBookings = (status, options = {}) => {
    return useInfiniteQuery({
        queryKey: ['bookings', status],
        queryFn: ({ pageParam = 1 }) => bookings({ status, page: pageParam }),
        getNextPageParam: (lastPage) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        ...options,
    })
}

export const useAllBooking = (status, options = {}) => {
    return useInfiniteQuery({
        queryKey: ['all-bookings', status],
        queryFn: ({ pageParam = 1 }) => allbooking({ status, page: pageParam }),
        getNextPageParam: (lastPage) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        ...options,
    })
}
