import Icon from '@ant-design/icons'
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'
import React from 'react'

const DivisionSvg: React.FC<CustomIconComponentProps> = (props) => {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M5.84998 5.65073H13C13.359 5.65073 13.65 5.93182 13.65 6.27857V19.4631C13.65 19.8098 13.359 20.0909 13 20.0909H5.84998C5.49099 20.0909 5.19997 19.8098 5.19997 19.4631V6.27857C5.20002 5.93182 5.49103 5.65073 5.84998 5.65073ZM7.47498 9.41774H11.375C11.734 9.41774 12.025 9.13665 12.025 8.78989C12.025 8.44314 11.734 8.16205 11.375 8.16205H7.47498C7.11598 8.16205 6.82497 8.44314 6.82497 8.78989C6.82497 9.13665 7.11603 9.41774 7.47498 9.41774ZM7.47498 13.1847H11.375C11.734 13.1847 12.025 12.9037 12.025 12.5569C12.025 12.2101 11.734 11.9291 11.375 11.9291H7.47498C7.11598 11.9291 6.82497 12.2101 6.82497 12.5569C6.82497 12.9037 7.11603 13.1847 7.47498 13.1847ZM7.47498 16.9517H11.375C11.734 16.9517 12.025 16.6707 12.025 16.3239C12.025 15.9772 11.734 15.6961 11.375 15.6961H7.47498C7.11598 15.6961 6.82497 15.9772 6.82497 16.3239C6.82502 16.6707 7.11603 16.9517 7.47498 16.9517ZM0 17.8935H1.30002C1.65901 17.8935 1.95002 17.6124 1.95002 17.2656C1.95002 16.9189 1.65901 16.6378 1.30002 16.6378H0V15.0682H1.30002C1.65901 15.0682 1.95002 14.7871 1.95002 14.4404C1.95002 14.0936 1.65901 13.8125 1.30002 13.8125H0V12.243H1.30002C1.65901 12.243 1.95002 11.9619 1.95002 11.6151C1.95002 11.2684 1.65901 10.9873 1.30002 10.9873H0V9.41769C0 9.07094 0.291012 8.78985 0.650008 8.78985H4.22503V19.463C4.22503 19.6862 4.27329 19.8986 4.36026 20.0909H0.650008C0.291012 20.0909 0 19.8098 0 19.4631L0 17.8935ZM11.7 4.70899V0.628083C11.7 0.228381 12.0816 -0.0695511 12.4862 0.0141666L21.5862 1.89765C21.8859 1.95969 22.1 2.21551 22.1 2.51156V19.4631C22.1 19.8098 21.809 20.0909 21.45 20.0909H14.4898C14.5768 19.8986 14.625 19.6863 14.625 19.4631V6.27857C14.625 5.41171 13.8975 4.70899 13 4.70899H11.7ZM18.85 5.02289V16.01C18.85 16.3567 19.141 16.6378 19.5 16.6378C19.859 16.6378 20.15 16.3567 20.15 16.01V5.02289C20.15 4.67614 19.859 4.39505 19.5 4.39505C19.141 4.39505 18.85 4.67618 18.85 5.02289ZM16.25 4.39509V16.01C16.25 16.3568 16.541 16.6378 16.9 16.6378C17.259 16.6378 17.55 16.3568 17.55 16.01V4.39509C17.55 4.04834 17.259 3.76725 16.9 3.76725C16.541 3.76725 16.25 4.04834 16.25 4.39509Z" fill="black"/>
        </svg>
    )
}

export const DivisionIcon: React.FC = (props) => {
    return (
        <Icon component={DivisionSvg} {...props} width='26' height='26' viewBox="0 0 24 24"/>
    )
}