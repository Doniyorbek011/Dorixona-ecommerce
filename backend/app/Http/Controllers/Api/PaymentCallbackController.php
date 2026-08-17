<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PaymentCallbackController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Click Shop API callback endpoint.
     */
    public function clickCallback(Request $request): JsonResponse
    {
        $params = $request->all();
        $result = $this->paymentService->handleClickCallback($params);

        $httpStatus = (isset($result['error']) && $result['error'] < 0)
            ? Response::HTTP_BAD_REQUEST
            : Response::HTTP_OK;

        return response()->json($result, $httpStatus);
    }

    /**
     * Payme JSON-RPC callback endpoint.
     */
    public function paymeCallback(Request $request): JsonResponse
    {
        $payload = $request->all();
        $authHeader = $request->header('Authorization');

        $result = $this->paymentService->handlePaymeCallback($payload, $authHeader);

        // Payme expects HTTP 200 even for RPC error codes per JSON-RPC spec, but returns error object
        return response()->json($result, Response::HTTP_OK);
    }

    /**
     * Uzum Bank webhook callback endpoint.
     */
    public function uzumCallback(Request $request): JsonResponse
    {
        $params = $request->all();
        $signatureHeader = $request->header('X-Signature') ?: $request->header('Signature');

        $result = $this->paymentService->handleUzumCallback($params, $signatureHeader);

        if (isset($result['success']) && !$result['success']) {
            $status = ($result['error'] ?? '') === 'INVALID_SIGNATURE' || ($result['error'] ?? '') === 'MISSING_SIGNATURE'
                ? Response::HTTP_UNAUTHORIZED
                : Response::HTTP_BAD_REQUEST;

            return response()->json($result, $status);
        }

        return response()->json($result, Response::HTTP_OK);
    }
}
