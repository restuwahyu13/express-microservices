export interface APIResponse {
	service_name: string
	ip_address: string
	stat_code: number
	stat_message: string
	data?: any
	pagination?: Record<string, any> | null
}

export const apiResponse = (
	service: string,
	ip: string,
	code: number,
	message: string,
	data?: any,
	pagination?: Record<string, any> | null
): APIResponse => {
	return {
		service_name: service,
		ip_address: ip,
		stat_code: code,
		stat_message: message,
		data: data || null,
		pagination: pagination || null
	}
}
