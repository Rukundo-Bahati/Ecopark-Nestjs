export declare enum UserMissionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    VERIFIED = "verified"
}
export declare class CreateUserMissionDto {
    missionId: string;
    status?: UserMissionStatus;
    proofUrl?: string;
}
